<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NotiExpirePayment extends Mailable
{
    use Queueable, SerializesModels;
    public $seat;
    public $show_infor;
    public $reservation_id;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($seat, $show_infor, $reservation_id)
    {
        //

        $this->seat = $seat;
        $this->show_infor = $show_infor;
        $this->reservation_id = $reservation_id;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $seat_str = "";
        $total = 0;
        foreach ($this->seat as $s) {
            $seat_str .= $s->row . $s->number . ', ';
            $total += $this->show_infor['price'];
        }



        Log::info('total' . json_encode($total));
        $data = [
            'seat_list' => $seat_str,
            'total' => $total,
            'reservation_id' => $this->reservation_id,
            'cinema_name' => $this->show_infor['cinema_name'],
            'cinema_address' => $this->show_infor['cinema_address'],
            'start_time' => $this->show_infor['start_time'],
            'movies_title' => $this->show_infor['movies_title'],
            'date' => $this->show_infor['date'],


        ];

        return $this->from($address = 'filmcenter.site@gmail.com', $name = 'Fimcenter.site')
            ->subject("Thanh toán vé xem phim")
            ->view('check_expire_payment', ['data' => $data]);
    }
}
