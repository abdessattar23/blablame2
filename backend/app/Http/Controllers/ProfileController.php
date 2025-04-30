<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

class ProfileController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    private function profileCompleted(){
        User::where('id', Auth::id())->update(['profile_completed' => (bool) 1]);
    }

    public function me(Request $request)
    {
        try {
            $data = User::with([
                'blablas' => function($query) {
                    $query->latest()->with('category:id,name');
                },
                'reviewsReceived' => function($query) {
                    $query->latest()->with('reviewer:id,name,avatar');
                }
            ])->withCount('reviewsReceived')
              ->withAvg('reviewsReceived as average_rating', 'rating')
              ->findOrFail($request->user()->id);

            return response()->json(['data' => $data]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20|regex:/^[+]?[\d\s-]+$/',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'zip' => 'nullable|string|max:20|regex:/^[\w\s-]+$/',
                'specialization' => 'nullable|string|max:255',
                'teaching_experience' => 'nullable|string|max:2000',
                'diplomas' => 'nullable|array',
            ]);

            // Log data being passed to update for debugging
            \Log::info('Profile update data:', $data);

            $user = $request->user();

            // Explicitly update fields that might be problematic
            if (isset($data['specialization'])) {
                $user->specialization = $data['specialization'];
            }

            if (isset($data['teaching_experience'])) {
                $user->teaching_experience = $data['teaching_experience'];
            }

            if (isset($data['diplomas'])) {
                $user->diplomas = $data['diplomas'];
            }

            // Update all validated data
            $user->update($data);
            $this->profileCompleted();

            return response()->json(['data' => User::findOrFail($request->user()->id)]);
        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048|dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
            ]);

            $user = $request->user();

            if ($user->avatar && file_exists(public_path($user->avatar))) {
                unlink(public_path($user->avatar));
            }

            $avatarName = time().'.'.$request->avatar->extension();
            $request->avatar->move(public_path('avatars'), $avatarName);

            $user->update([
                'avatar' => 'avatars/'.$avatarName
            ]);

            return response()->json(['data' => $user]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $request->validate([
                'password' => 'required|string|min:6|confirmed',
            ]);

            $request->user()->update([
                'password' => bcrypt($request->password)
            ]);

            return response()->json(['data' => $request->user()]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function validateCIN(Request $request)
{
    try {
        $request->validate([
            'recto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'verso' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = $request->user();

        $rectoPath = $request->file('recto')->store('documents', 'private');
        $versoPath = $request->file('verso')->store('documents', 'private');

        $user->update([
            'cin_recto' => $rectoPath,
            'cin_verso' => $versoPath,
            'cin_verified' => (bool) false
        ]);

        return response()->json([
            'data' => $user,
            'message' => 'CIN uploaded securely'
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    public function uploadDiplomas(Request $request)
    {
        try {
            if (!$request->user()->isTeacher()) {
                return response()->json(['error' => 'Only teachers can upload diplomas'], 403);
            }

            // $request->validate([
            //     'diplomas.*' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120'
            // ]);

            $user = $request->user();
            $diplomaPaths = [];

            foreach ($request->file('diplomas') as $diploma) {
                $fileName = 'diploma_' . time() . '_' . uniqid() . '.' . $diploma->extension();
                $diploma->move(public_path('documents'), $fileName);
                $diplomaPaths[] = 'documents/' . $fileName;
            }

            $existingDiplomas = $user->diplomas ?? [];
            $allDiplomas = array_merge($existingDiplomas, $diplomaPaths);

            $user->update([
                'diplomas' => $allDiplomas,
                'diplomas_verified' => false
            ]);

            return response()->json(['data' => $user, 'message' => 'Diplomas uploaded successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateTeacherProfile(Request $request)
    {
        try {
            if (!$request->user()->isTeacher()) {
                return response()->json(['error' => 'Only teachers can update teacher profile'], 403);
            }

            $data = $request->validate([
                'specialization' => 'required|string|max:255',
                'teaching_experience' => 'required|string|max:2000'
            ]);

            $request->user()->update($data);
            return response()->json(['data' => $request->user()]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAllTeachers(){
        try {
            $teachers = User::where('role', 'teacher')
                ->where('status', 'active')
                ->select('id', 'name', 'avatar', 'verified')
                ->withCount('reviewsReceived')
                ->withAvg('reviewsReceived as average_rating', 'rating')
                ->get();

            return response()->json(['data' => $teachers]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getTeacherProfile($id) {
        try {
            $teacher = User::where('role', 'teacher')
                ->withCount('reviewsReceived')
                ->withAvg('reviewsReceived as average_rating', 'rating')
                ->findOrFail($id);

            $teacher->load([
                'reviewsReceived' => function($query) {
                    $query->latest()->with('reviewer:id,name,avatar')->take(5);
                }
            ]);

            return response()->json(['data' => $teacher]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
