<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class VideoController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(Video::class, 'video', [
            'except' => ['index', 'show', 'getTeacherVideos']
        ]);
    }

    public function index()
    {
        try {
            return response()->json([
                'data' => Video::with(['user:id,name,avatar,verified', 'category:id,name'])
                    ->latest()
                    ->paginate(15)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getTeacherVideos($teacherId)
    {
        try {
            return response()->json([
                'data' => Video::where('user_id', $teacherId)
                    ->with(['category:id,name'])
                    ->latest()
                    ->paginate(10)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validate teacher role
            if ($request->user()->role !== 'teacher') {
                return response()->json(['error' => 'Only teachers can upload videos'], 403);
            }

            $data = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'link' => 'required|string|url|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:5000',
            ]);

            // Validate YouTube link
            if (!$this->isValidYouTubeUrl($data['link'])) {
                return response()->json(['error' => 'Invalid YouTube URL'], 400);
            }

            $data['user_id'] = $request->user()->id;
            $video = Video::create($data);

            return response()->json([
                'data' => $video->load(['user:id,name,avatar,verified', 'category:id,name']),
                'message' => 'Video added successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Video $video)
    {
        try {
            return response()->json([
                'data' => $video->load(['user:id,name,avatar,verified', 'category:id,name'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Video $video)
    {
        try {
            $data = $request->validate([
                'category_id' => 'sometimes|exists:categories,id',
                'link' => 'sometimes|string|url|max:255',
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string|max:5000',
            ]);

            // Validate YouTube link if provided
            if (isset($data['link']) && !$this->isValidYouTubeUrl($data['link'])) {
                return response()->json(['error' => 'Invalid YouTube URL'], 400);
            }

            $video->update($data);

            return response()->json([
                'data' => $video->load(['user:id,name,avatar,verified', 'category:id,name']),
                'message' => 'Video updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Video $video)
    {
        try {
            $video->delete();
            return response()->json(['message' => 'Video deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Validate if the URL is a valid YouTube URL.
     *
     * @param string $url
     * @return bool
     */
    private function isValidYouTubeUrl($url)
    {
        $pattern = '/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/';
        return preg_match($pattern, $url) === 1;
    }

    /**
     * Get my videos (for the authenticated teacher).
     */
    public function myVideos(Request $request)
    {
        try {
            if ($request->user()->role !== 'teacher') {
                return response()->json(['error' => 'Only teachers can access their videos'], 403);
            }

            return response()->json([
                'data' => Video::where('user_id', $request->user()->id)
                    ->with(['category:id,name'])
                    ->latest()
                    ->paginate(10)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
