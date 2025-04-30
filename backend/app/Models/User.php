<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'city',
        'state',
        'zip',
        'country',
        'role',
        'status',
        'avatar',
        'profile_completed',
        'verified',
        'specialization',
        'teaching_experience',
        'diplomas',
        'cin_recto',
        'cin_verso'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'profile_completed' => 'boolean',
        'verified' => 'boolean',
    ];

    public function blablas()
    {
        return $this->hasMany(Blabla::class);
    }

    // Reviews where this user is the reviewer
    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    // Reviews where this user is being reviewed (as a teacher)
    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'reviewed_id');
    }

    // Calculate the average rating for a teacher
    public function getAverageRatingAttribute()
    {
        return $this->reviewsReceived()->avg('rating') ?? 0;
    }

    // Check if the user is a teacher
    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    public function is_active()
    {
        return $this->status === 'active';
    }

    public function has_cin(){
        return $this->cin_verified === 1;
    }

    public function has_diploma(){
        return $this->diplomas_verified === 1;
    }
    /**
     * Get the videos that belong to the user.
     */
    public function videos()
    {
        return $this->hasMany(Video::class);
    }
}
