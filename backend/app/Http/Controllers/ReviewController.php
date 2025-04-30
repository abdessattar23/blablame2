<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class ReviewController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(Review::class, 'review', [
            'except' => ['index', 'show', 'getTeacherReviews']
        ]);
    }

    public function index()
    {
        try {
            return response()->json([
                'data' => Review::with(['reviewer:id,name,avatar', 'reviewed:id,name,avatar'])
                    ->latest()
                    ->paginate(15)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getTeacherReviews($teacherId)
    {
        try {
            $teacher = User::findOrFail($teacherId);

            if ($teacher->role !== 'teacher') {
                return response()->json(['error' => 'User is not a teacher'], 400);
            }

            return response()->json([
                'data' => Review::where('reviewed_id', $teacherId)
                    ->with('reviewer:id,name,avatar')
                    ->latest()
                    ->paginate(10),
                'average_rating' => $teacher->average_rating
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Check if the reviewer is a student
            if ($request->user()->role !== 'student') {
                return response()->json(['error' => 'Only students can submit reviews'], 403);
            }

            $data = $request->validate([
                'reviewed_id' => 'required|exists:users,id,role,teacher',
                'comment' => 'required|string|max:1000',
                'rating' => 'required|integer|min:1|max:5',
            ]);

            // Check if the reviewed user is a teacher
            $teacher = User::findOrFail($data['reviewed_id']);
            if ($teacher->role !== 'teacher') {
                return response()->json(['error' => 'You can only review teachers'], 400);
            }

            // Prevent self-reviews
            if ($request->user()->id == $data['reviewed_id']) {
                return response()->json(['error' => 'You cannot review yourself'], 400);
            }

            // Check if user has already reviewed this teacher
            $existingReview = Review::where('reviewer_id', $request->user()->id)
                ->where('reviewed_id', $data['reviewed_id'])
                ->first();

            if ($existingReview) {
                return response()->json([
                    'error' => 'You have already reviewed this teacher. Please update your existing review instead.'
                ], 400);
            }

            $data['reviewer_id'] = $request->user()->id;
            $review = Review::create($data);

            return response()->json([
                'data' => $review->load(['reviewer:id,name,avatar', 'reviewed:id,name,avatar']),
                'message' => 'Review posted successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Review $review)
    {
        try {
            return response()->json([
                'data' => $review->load(['reviewer:id,name,avatar', 'reviewed:id,name,avatar'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Review $review)
    {
        try {
            $data = $request->validate([
                'comment' => 'sometimes|string|max:1000',
                'rating' => 'sometimes|integer|min:1|max:5',
            ]);

            $review->update($data);

            return response()->json([
                'data' => $review->load(['reviewer:id,name,avatar', 'reviewed:id,name,avatar']),
                'message' => 'Review updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Review $review)
    {
        try {
            $review->delete();
            return response()->json(['message' => 'Review deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
