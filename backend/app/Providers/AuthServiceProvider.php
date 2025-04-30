<?php

namespace App\Providers;

use App\Models\Blabla;
use App\Models\Review;
use App\Models\Video;
use App\Policies\BlablaPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\VideoPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Blabla::class => BlablaPolicy::class,
        Review::class => ReviewPolicy::class,
        Video::class => VideoPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
