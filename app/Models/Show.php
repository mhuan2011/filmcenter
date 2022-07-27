<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    use HasFactory;
    protected $table = 'show';
    protected $guarded = [];

    // relationshp
    public function movies()
    {
        return $this->belongsTo(Movies::class, 'movie_id', 'id');
    }

    public function cinema_hall()
    {
        return $this->belongsTo(CinemaHall::class);
    }
}
