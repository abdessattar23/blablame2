<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'category',
        'created_by'
    ];

    /**
     * Get the user who created the news item.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
