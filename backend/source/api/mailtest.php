<?php
require 'phpmailer/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {

    // SMTP settings for cPanel mail
    $mail->isSMTP();
	$mail->Host       = 'ng-ssl.com'; 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'do_not_reply@ng-ssl.com'; // full email
    $mail->Password   = 'zz2X40U92sDsHqa9';   // cpanel mailbox pass
    $mail->SMTPSecure = 'ssl'; // or tls
    $mail->Port       = 465;   // if ssl use 465 , if tls use 587
    // $mail->Host       = 'mail.yourdomain.com'; 
    // $mail->SMTPAuth   = true;
    // $mail->Username   = 'support@yourdomain.com'; // full email
    // $mail->Password   = 'your-email-password';   // cpanel mailbox pass
    // $mail->SMTPSecure = 'ssl'; // or tls
    // $mail->Port       = 465;   // if ssl use 465 , if tls use 587
	

    // Sender
    $mail->setFrom('do_not_reply@ng-ssl.com', 'Do Not Reply');

    // Receiver
    $mail->addAddress('rubel714@gmail.com', 'Test Receiver');

    // CC
    $mail->addCC('rubel714@yahoo.com');
    // $mail->addCC('account@yourdomain.com');

    // multiple attachments
    // $files = [
        // '/home/yourcpaneluser/public_html/files/test.pdf',
        // '/home/yourcpaneluser/public_html/files/image.jpg'
    // ];    
	
	$files = [
        'log.txt',
        'Client List.xlsx'
    ];

    foreach($files as $f){
        $mail->addAttachment($f);
    }

    // email content
    $mail->isHTML(true);
    $mail->Subject = 'Test Mail from cPanel SMTP';
    $mail->Body    = 'This mail sent from Cpanel SMTP server with multiple attachment & CC.';

    $mail->send();
    echo "Mail Sent Successfully";

} catch (Exception $e) {
    echo "Error: {$mail->ErrorInfo}";
}
