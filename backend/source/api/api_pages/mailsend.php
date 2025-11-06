<?php
$lan = trim($data->lan);
$UserId = trim($data->UserId);
$TransactionId = $data->rowData->id;

// $returnData = [
// 				"success" => 0,
// 				"status" => 400,
// 				"message" => $TransactionId
// 			];
// return $returnData;
// exit;

require 'phpmailer/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

// echo "<pre>";
// print_r($data);

try {
    $dbh = new Db();

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




    $sql = "select ifnull(a.CoordinatorId,0) CoordinatorId, ifnull(a.LeadAuditorId,0) LeadAuditorId, 
        REPLACE(a.TeamAuditorIds, '" . '"' . "', '') as TeamAuditorIds, a.AttachedDocuments,
        a.AssessmentNo,DATE_FORMAT(a.AuditStartDate, '%d-%b-%Y') AS AuditStartDate,
        DATE_FORMAT(a.AuditEndDate, '%d-%b-%Y') AS AuditEndDate,b.FactoryName
        from t_transaction a
        INNER JOIN t_factory b ON a.FactoryId=b.FactoryId
        where a.TransactionId=$TransactionId";
    $resultdata = $dbh->query($sql);
    $CoordinatorId = $resultdata[0]['CoordinatorId'];
    $LeadAuditorId = $resultdata[0]['LeadAuditorId'];
    $TeamAuditorIds = $resultdata[0]['TeamAuditorIds'];
    $AttachedDocuments = $resultdata[0]['AttachedDocuments'];
    $FactoryName = $resultdata[0]['FactoryName'];
    $AuditStartDate = $resultdata[0]['AuditStartDate'];
    $AuditEndDate = $resultdata[0]['AuditEndDate'];


    $sql = "select AuditorName,Email from t_auditor where AuditorId=$LeadAuditorId";
    $resultdata = $dbh->query($sql);
    $LeadAuditorEmail = $resultdata[0]['Email'];
    $LeadAuditorName = $resultdata[0]['AuditorName'];


    // Receiver
    if ($LeadAuditorEmail) {
        $mail->addAddress($LeadAuditorEmail, $LeadAuditorName);
    }
    // $mail->addAddress('rubel714@gmail.com', 'Test Receiver');

    $TeamAuditorNames = "-";
    if ($TeamAuditorIds != '[]') {
        $Ids = json_decode($TeamAuditorIds);

        foreach ($Ids as $TAId) {
            $sql = "select AuditorName,Email from t_auditor where AuditorId=$TAId";
            $resultdata = $dbh->query($sql);
            $TeamAuditorEmail = $resultdata[0]['Email'];
            $TeamAuditorName = $resultdata[0]['AuditorName'];

            if ($TeamAuditorNames == "-") {
                $TeamAuditorNames = $TeamAuditorName;
            } else {
                $TeamAuditorNames .= ", " . $TeamAuditorName;
            }

            if ($TeamAuditorEmail) {
                $mail->addAddress($TeamAuditorEmail, $TeamAuditorName);
            }
        }
    }


    $sql = "select UserName,Email from t_users where UserId=$CoordinatorId";
    $resultdata = $dbh->query($sql);
    $CoordinatorEmail = $resultdata[0]['Email'];
    $CoordinatorName = $resultdata[0]['UserName'];

    // CC
    if ($CoordinatorEmail) {
        $mail->addCC($CoordinatorEmail, $CoordinatorName);
        // $mail->addCC('rubel714@yahoo.com');
    }
    // $mail->addCC('account@yourdomain.com');

    // multiple attachments
    // $files = [
    // '/home/yourcpaneluser/public_html/files/test.pdf',
    // '/home/yourcpaneluser/public_html/files/image.jpg'
    // ];    

    // $files = [
    //     'log.txt',
    //     'Client List.xlsx'
    // ];


    // [{"name":"spaider.png","extention":"png","size":17820,"status":"","file":""},{"name":"Correction.txt","extention":"txt","size":504,"status":"","file":""}]
    $AttachedDocuments = json_decode($AttachedDocuments);
    $path = '../../../image/transaction/' . $TransactionId . '/';
    foreach ($AttachedDocuments as $attobj) {
        $mail->addAttachment($path . $attobj->name);
    }

    // $files = [
    //     'log.txt'
    // ];

    // foreach($files as $f){
    //     $mail->addAttachment($f);
    // }

    // email content
    $mail->isHTML(true);
    $mail->Subject = "Audit Schedule for $AuditStartDate"; //$AuditStartDate

    $bodyHTML    = "<span>Hello Auditor(s),</span>
                    <p>Please find below details of your audit assignment.</p>
                    <table border='1'>
                    <tr>
                        <td>Job No.</td>
                        <td>$AssessmentNo</td>
                        <td>Client</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Assessment Type</td>
                        <td>-</td>
                        <td>Assessment SubType</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Audit Type</td>
                        <td>-</td>
                        <td>Schedule Type</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Audit Start Date</td>
                        <td>$AuditStartDate</td>
                        <td>Audit End Date</td>
                        <td>$AuditEndDate</td>
                    </tr>
                    <tr>
                        <td>Report Office of the Lead Auditor</td>
                        <td>-</td>
                        <td>Lead Auditor</td>
                        <td>$LeadAuditorName</td>
                    </tr>
                    <tr>
                        <td>Auditor</td>
                        <td colspan='3'>$TeamAuditorNames</td>
                    </tr>
                    <tr>
                        <td>Factory English Name</td>
                        <td>$FactoryName</td>
                        <td>Factory Local Name</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Factory English Address</td>
                        <td>-</td>
                        <td>Factory Local Address</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Contact Name</td>
                        <td>-</td>
                        <td>Contact Title</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Contact Telephone</td>
                        <td>-</td>
                        <td>Contact Mobile</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>AE Name</td>
                        <td>-</td>
                        <td>CS Name</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Registration No. for Intertek programs</td>
                        <td >-</td>
                        <td>Service Type</td>
                        <td >-</td>
                    </tr>
                    <tr>
                        <td><strong>Special Note (if client requirement applies):</strong></td>
                        <td colspan='3'>
                        <strong>A delay in the 24-hour reporting of Critical NC will result to audit fee deduction.</strong>
                        <p>As an Intertek auditor assigned for this audit, you are responsible for notifying your line manager if you have relationship to the facility/its representatives and/or provided relevant consultancy services, including the conduct of internal audits, within the last 2 years.</p>
                        </td>
                    </tr>
                    </table>
                    <p>Thanks</p>";

    $mail->Body = $bodyHTML;

    // return  $returnData = [
    // 			"success" => 0,
    // 			"status" => 400,
    // 			"message" => $bodyHTML
    // 		];

    //// $mail->send();

    if ($mail->send()) {

        $aQuerys = array();

        $IsSendMail = 1;
        $u = new updateq();
        $u->table = 't_transaction';
        $u->columns = ["IsSendMail"];
        $u->values = [$IsSendMail];
        $u->pks = ['TransactionId'];
        $u->pk_values = [$TransactionId];
        $u->build_query();
        $aQuerys[] = $u;
        exec_query($aQuerys, $UserId, $lan);

        $returnData = [
            "success" => 1,
            "status" => 200,
            "message" => "Mail Sent Successfully"
        ];
    } else {
        $returnData = [
            "success" => $success,
            "status" => $status,
            "UserId" => $UserId,
            "message" => "Mail can not Sent"
        ];
    }
    //echo "Mail Sent Successfully";


} catch (Exception $e) {
    // echo "Error: {$mail->ErrorInfo}";
    $returnData = [
        "success" => 0,
        "status" => 200,
        "message" => $mail->ErrorInfo
    ];
}



return $returnData;
