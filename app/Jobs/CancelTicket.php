<?php

namespace App\Jobs;

use App\Mail\NotiCancleTicket;
use App\Models\Reservation;
use App\Models\ShowSeat;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CancelTicket implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $resevation_id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($resevation_id)
    {
        //
        $this->resevation_id = $resevation_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $id = $this->resevation_id;
        $show = ShowSeat::where('show_id', $id)
            ->join('reservation', 'reservation.id', 'show_seat.reservation_id')
            ->leftJoin('users', 'users.id', 'reservation.user_id')
            ->where('reservation.status', 'Chưa thanh toán')
            ->groupBy('show_seat.reservation_id', 'users.email', 'users.name')
            ->get(['users.email', 'show_seat.reservation_id', 'users.name']);


        if (!empty($show)) {
            foreach ($show as $s) {
                $r = Reservation::find($s->reservation_id);
                if ($r) {
                    $r->status = 'Hết hạn';
                    $r->save();
                }
                ShowSeat::where('reservation_id', $s->reservation_id)->update([
                    'reservation_id' => '',
                    'status' => '0'
                ]);
                try {
                    Mail::to($r->email)->send(new NotiCancleTicket($s->reservation_id));
                } catch (Exception $err) {
                }
            }
        };
    }
}
