<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Review $review): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        // Anyone can create a review
        return true;
    }

    public function update(User $user, Review $review): bool
    {
        // Only the reviewer can update their review
        return $user->id === $review->reviewer_id;
    }

    public function delete(User $user, Review $review): bool
    {
        // Only the reviewer can delete their review
        return $user->id === $review->reviewer_id;
    }
}
