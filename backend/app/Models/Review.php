<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reviewer_id',
        'reviewed_id',
        'comment',
        'rating',
    ];

    /**
     * Get the reviewer who wrote the review.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Get the teacher who was reviewed.
     */
    public function reviewed()
    {
        return $this->belongsTo(User::class, 'reviewed_id');
    }
}
