<?php

namespace App\Policies;

use App\Models\Video;
use App\Models\User;

class VideoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Video $video): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        // Only teachers can create videos
        return $user->role === 'teacher';
    }

    public function update(User $user, Video $video): bool
    {
        // Only the video owner can update it
        return $user->id === $video->user_id;
    }

    public function delete(User $user, Video $video): bool
    {
        // Only the video owner can delete it
        return $user->id === $video->user_id;
    }
}
