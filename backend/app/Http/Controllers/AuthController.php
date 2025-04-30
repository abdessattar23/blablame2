<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controller as BaseController;

class AuthController extends BaseController
{
    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage(),
            ], 500);
        }

        if (!auth()->attempt($data)) {
            return response()->json([
                'message' => 'Login failed',
                'error' => 'Invalid credentials',
            ], 401);
        }

        $user = auth()->user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'zip' => 'nullable|string|max:20',
                'country' => 'nullable|string|max:100',
                'role' => 'nullable|string|in:student,teacher',
            ]);

            $data['password'] = bcrypt($data['password']);
            $data['status'] = 'pending';
            $user = User::create($data);
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User creation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
