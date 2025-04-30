<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StatusMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $status): Response
    {
        if (User::where('id', $request->user()->id)->first()->status !== $status) {
            return redirect('/')->with('error', 'You do not have permission to access this page.');
        }
        return $next($request);
    }
}
