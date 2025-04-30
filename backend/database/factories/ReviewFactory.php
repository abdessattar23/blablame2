<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Get random users, but make sure the reviewer is not the same as the reviewed user
        $reviewer = User::inRandomOrder()->first();
        $reviewed = User::where('id', '!=', $reviewer->id)
                    ->where('role', 'teacher')
                    ->inRandomOrder()
                    ->first();

        return [
            'reviewer_id' => $reviewer->id,
            'reviewed_id' => $reviewed->id,
            'comment' => $this->faker->paragraph(),
            'rating' => $this->faker->numberBetween(1, 5),
        ];
    }
}
