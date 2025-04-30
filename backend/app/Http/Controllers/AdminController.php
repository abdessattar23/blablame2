<?php

namespace App\Http\Controllers;

use App\Helpers\AIHelper;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'users_count' => User::count(),
            'pending_users' => User::where('status', 'pending')->count(),
            'categories_count' => Category::count(),
            'teachers_count' => User::where('role', 'teacher')->count(),
            'students_count' => User::where('role', 'student')->count(),
            'unverified_users' => User::where('verified', false)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get all users
     */
    public function getUsers(Request $request)
    {
        $query = User::query();

        // Filter by role if provided
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by verification status if provided
        if ($request->has('verified')) {
            $query->where('verified', $request->verified === 'true');
        }

        $users = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get a specific user
     */
    public function getUser($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function getUserAsUser($id){
        $user = User::where('id', $id)->select('id', 'name', 'avatar')->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $user
        ]);


    }

    /**
     * Update user status (accept/reject pending users)
     */
    public function updateUserStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['active', 'pending', 'rejected'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($id);
        $user->status = $request->status;
        $user->save();

        // You could send a notification email based on status change
        // For example, when a user is approved

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User status updated successfully'
        ]);
    }

    /**
     * Validate a user's CIN documents
     */
    public function validateUserCIN(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $response = AIHelper::geminiCIN($user->cin_recto);
        if(\Str::startsWith($response, "VALID")){
            $user->cin_verified = true;
        }else{
            $user->cin_verified = false;
        }
        $user->save();

        // You could send a notification email when verification is complete

        return response()->json([
            'success' => true,
            'data' => $response,
            'message' => 'User CIN validated successfully'
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf,zip|max:10240',
        ]);

        $path = $request->file('file')->store('uploads', 'public');

        return response()->json([
            'success' => true,
            'path' => Storage::url($path)
        ]);
    }
    /**
     * Get all categories
     */
    public function getCategories()
    {
        $categories = Category::all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Create a new category
     */
    public function createCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category created successfully'
        ], 201);
    }

    /**
     * Update a category
     */
    public function updateCategory(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($id)],
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category updated successfully'
        ]);
    }

    /**
     * Delete a category
     */
    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);

        // Check if category has associated blablas
        if ($category->blablas()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category because it has associated blablas'
            ], 400);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    /**
     * Send newsletter to all users or specific role
     */
    public function sendNewsletter(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'role' => 'nullable|string|in:student,teacher,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $query = User::where('status', 'active');

        // Filter by role if specified
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->get();
        $count = $users->count();

        foreach ($users as $user) {
            Mail::to($user->email)->queue(new \App\Mail\Newsletter(
                $request->subject,
                $request->content
            ));
        }

        return response()->json([
            'success' => true,
            'message' => "Newsletter queued for delivery to {$count} users. Emails will be sent in the background.",
        ]);
    }

    /**
     * Create a new admin user (can only be done by existing admin)
     */
    public function createAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
            'status' => 'active',
            'verified' => true,
            'profile_completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin account created successfully',
            'data' => $admin
        ], 201);
    }
}
