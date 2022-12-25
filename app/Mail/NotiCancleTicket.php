<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotiCancleTicket extends Mailable
{
    use Queueable, SerializesModels;

    public $id;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($id)
    {
        //
        $this->id = $id;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $data = [
            'reservation_id' => $this->id,
        ];
        return $this->from($address = 'filmcenter.site@gmail.com', $name = 'Fimcenter.site')
            ->subject("Thông báo hủy vé xem phim")
            ->view('cancle_ticket', ['data' => $data]);
    }
}
