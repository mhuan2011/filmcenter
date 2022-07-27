<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShowSeat extends Model
{
    use HasFactory;
    protected $table = 'show_seat';
    protected $guarded = [];
    public $timestamps = false;

    public function seat()
    {
        return $this->belongsTo(Seat::class, 'seat_id', 'id');
    }
}
