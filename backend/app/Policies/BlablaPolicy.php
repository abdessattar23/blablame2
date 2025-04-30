<?php

namespace App\Policies;

use App\Models\Blabla;
use App\Models\User;

class BlablaPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Blabla $blabla): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Blabla $blabla): bool
    {
        return $user->id === $blabla->user_id;
    }

    public function delete(User $user, Blabla $blabla): bool
    {
        return $user->id === $blabla->user_id;
    }
}
