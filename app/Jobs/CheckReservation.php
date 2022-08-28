<?php

namespace App\Jobs;

use App\Models\Reservation;
use App\Models\ShowSeat;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckReservation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $reservation_id;
    protected $seats;
    /**
     * Create a new job instance.
     * 
     * @return void
     */

    public function __construct($reservation_id, $seats)
    {
        $this->reservation_id = $reservation_id;
        $this->seats = $seats;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
        $reservation = Reservation::where('id',  $this->reservation_id)->first();
        if ($reservation) {
            if ($reservation->status == 'Thanh toán') return;
            else {
                foreach ($this->seats as $seat) {
                    $res = ShowSeat::where('id', $seat)->update(['reservation_id' => null, 'status' => 0]);
                }
            }
        }
    }
}
