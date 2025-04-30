<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserDocuments
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $path = $request->path();

        if (!$user->is_active()) {
            if (!str_contains($path, 'profile/me/validateCIN') && !str_contains($path, 'profile/me/avatar') && !str_contains($path, 'profile/me')) {
                return response()->json([
                    'error' => 'Your account needs to be activated. Please upload your CIN first.',
                    'required_action' => 'upload_cin'
                ], 403);
            }
            return $next($request);
        }

        // if (str_contains($path, 'profile/me/avatar') && !$user->has_cin) {
        //     return response()->json([
        //         'error' => 'Please upload your CIN before setting an avatar.',
        //         'required_action' => 'upload_cin'
        //     ], 403);
        // }

        if ($user->role === 'teacher') {
            if (str_contains($path, 'profile/me/diplomas') && !$user->has_cin()) {
                return response()->json([
                    'error' => 'Please upload your CIN before uploading diplomas.',
                    'required_action' => 'upload_cin'
                ], 403);
            }

            if (str_contains($path, 'profile/me/update') && (!$user->has_cin() || !$user->has_diploma())) {
                return response()->json([
                    'error' => 'Please upload your CIN and diplomas before updating your profile.',
                    'required_action' => $user->has_cin() ? 'upload_diploma' : 'upload_cin'
                ], 403);
            }
        }

        if (str_contains($path, 'blablas') && $request->method() === 'POST') {
            if (!$user->is_active()) {
                return response()->json([
                    'error' => 'Your account needs to be activated before creating listings.',
                    'required_action' => 'await_activation'
                ], 403);
            }
        }

        return $next($request);
    }
}
