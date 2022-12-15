<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;
    protected $table = 'reservation';

    public function seat()
    {
        return $this->hasMany(ShowSeat::class);
    }

    public function show()
    {
        $show = $this->hasMany(ShowSeat::class);
    }
}
