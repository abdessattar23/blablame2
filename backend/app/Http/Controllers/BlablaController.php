<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Blabla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class BlablaController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $query = Blabla::with([
                'user:id,name',
                'category:id,name',
                'applications' => function($query) use ($user) {
                    if ($user->isTeacher()) {
                        $query->where('user_id', $user->id);
                    }
                }
            ])->latest();

            if (!$user->isTeacher()) {
                $query->where('user_id', $user->id);
            }

            return response()->json([
                'data' => $query->paginate(15)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:5000',
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'budget' => 'required|numeric|min:0|max:1000000',
            ]);

            $data['user_id'] = $request->user()->id;

            $data['image'] = $request->file('image')->store('blablas', 'public');
            $data['image'] = Storage::url($data['image']);

            $blabla = Blabla::create($data);

            return response()->json([
                'data' => $blabla->load(['user:id,name', 'category:id,name'])
            ], 201);
        } catch (\Exception $e) {
            if (isset($data['image']) && Storage::exists($data['image'])) {
                Storage::delete($data['image']);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Blabla $blabla)
    {
        try {
            return response()->json([
                'data' => $blabla->load(['user:id,name', 'category:id,name'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Blabla $blabla)
    {
        try {
            $data = $request->validate([
                'category_id' => 'sometimes|exists:categories,id',
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string|max:5000',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
                'budget' => 'sometimes|numeric|min:0|max:1000000',
            ]);

            if ($request->hasFile('image')) {
                if ($blabla->image && Storage::exists($blabla->image)) {
                    Storage::delete($blabla->image);
                }
                $data['image'] = $request->file('image')->store('blablas', 'public');
            }

            $blabla->update($data);

            return response()->json([
                'data' => $blabla->load(['user:id,name', 'category:id,name'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Blabla $blabla)
    {
        try {
            if ($blabla->image && Storage::exists($blabla->image)) {
                Storage::delete($blabla->image);
            }

            $blabla->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function apply($blabla, Request $request){
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:1000',
            ]);
            $user = auth()->user();
            $blabla = Blabla::findOrFail($blabla);

            if ($user->id === $blabla->user_id) {
                return response()->json(['error' => 'You cannot apply to your own blabla.'], 403);
            }

            if ($blabla->applications()->where('user_id', $user->id)->exists()) {
                return response()->json(['error' => 'You have already applied to this blabla.'], 403);
            }

            $blabla->applications()->create(['user_id' => $user->id, 'message' => $validated['message']]);

            return response()->json(['message' => 'Application submitted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function acceptApplication(Request $request, $applicationId)
    {
        $application = Application::findOrFail($applicationId);
        $user = $request->user();
        // Only the owner of the blabla can accept
        if ($application->blabla->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $application->status = 'accepted';
        $application->save();
        return response()->json(['message' => 'Application accepted successfully.']);
    }

    public function denyApplication(Request $request, $applicationId)
    {
        $application = \App\Models\Application::findOrFail($applicationId);
        $user = $request->user();
        // Only the owner of the blabla can deny
        if ($application->blabla->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $application->status = 'denied';
        $application->save();
        return response()->json(['message' => 'Application denied successfully.']);
    }
}
