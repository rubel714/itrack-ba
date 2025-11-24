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

    $extraCCEmail = array("akter.hossain@intertek.com"=>"Akter Hossain");   


    $sql = "select ifnull(a.CoordinatorId,0) CoordinatorId, ifnull(a.LeadAuditorId,0) LeadAuditorId, 
        REPLACE(a.TeamAuditorIds, '" . '"' . "', '') as TeamAuditorIds, a.AttachedDocuments, a.AssessmentNo,
        case when a.AuditStartDate is not null then DATE_FORMAT(a.AuditStartDate, '%d-%b-%Y') else '' end AuditStartDate,
        case when a.AuditEndDate is not null then DATE_FORMAT(a.AuditEndDate, '%d-%b-%Y') else '' end AuditEndDate,
        b.FactoryName,c.BuyerName,d.ProgramName,e.AuditStageName,a.ManDay,a.Remarks,f.LeadStatusName,

        case when a.Window is not null then DATE_FORMAT(a.Window, '%d-%b-%Y') else '' end Window
        ,case when a.WindowEnd is not null then DATE_FORMAT(a.WindowEnd, '%d-%b-%Y') else '' end WindowEnd,
        g.AuditorName as ReportWriterName,a.FactoryAddress,a.FactoryContactPersonPhone,a.FactoryContactPerson
        ,a.FactoryContactPersonEmail,a.FactoryHoliday,h.CountryName

        from t_transaction a
        INNER JOIN t_factory b ON a.FactoryId=b.FactoryId
        LEFT JOIN t_buyer c ON a.BuyerId=c.BuyerId
        LEFT JOIN t_program d ON a.ProgramId=d.ProgramId
        LEFT JOIN t_auditstage e ON a.AuditStageId=e.AuditStageId
        LEFT JOIN t_leadstatus f ON a.LeadStatusId=f.LeadStatusId
        LEFT JOIN t_auditor g ON a.ReportWriterId=g.AuditorId
        LEFT JOIN t_country h ON a.CountryId=h.CountryId 
        where a.TransactionId=$TransactionId";
    $resultdata = $dbh->query($sql);
    $CoordinatorId = $resultdata[0]['CoordinatorId'];
    $LeadAuditorId = $resultdata[0]['LeadAuditorId'];
    $TeamAuditorIds = $resultdata[0]['TeamAuditorIds'];
    $AttachedDocuments = $resultdata[0]['AttachedDocuments'];
    $FactoryName = $resultdata[0]['FactoryName'];
    $FactoryAddress = $resultdata[0]['FactoryAddress'];
    $FactoryContactPersonPhone = $resultdata[0]['FactoryContactPersonPhone'];
    $FactoryContactPerson = $resultdata[0]['FactoryContactPerson'];
    $FactoryContactPersonEmail = $resultdata[0]['FactoryContactPersonEmail'];
    $FactoryHoliday = $resultdata[0]['FactoryHoliday'];

    $AuditStartDate = $resultdata[0]['AuditStartDate'];
    $AuditEndDate = $resultdata[0]['AuditEndDate'];
    $AuditStartEndDate = "";
    if($AuditStartDate && $AuditEndDate){
        $AuditStartEndDate = "$AuditStartDate - $AuditEndDate";
    }else if($AuditStartDate){
        $AuditStartEndDate = $AuditStartDate;
    }else if($AuditEndDate){
        $AuditStartEndDate = $AuditEndDate;
    }

    $AssessmentNo = $resultdata[0]['AssessmentNo'];
    $BuyerName = $resultdata[0]['BuyerName'];
    $ProgramName = $resultdata[0]['ProgramName'];
    $AuditStageName = $resultdata[0]['AuditStageName'];
    $State = "";
    $ManDay = $resultdata[0]['ManDay'];
    $Remarks = $resultdata[0]['Remarks'];
    $LeadStatusName = $resultdata[0]['LeadStatusName'];
    $Window = $resultdata[0]['Window'];
    $WindowEnd = $resultdata[0]['WindowEnd'];
    $ReportWriterName = $resultdata[0]['ReportWriterName'];
    $CountryName = $resultdata[0]['CountryName'];

     $WindowDates = "";
    if($Window && $WindowEnd){
        $WindowDates = "$Window - $WindowEnd";
    }else if($Window){
        $WindowDates = $Window;
    }else if($WindowEnd){
        $WindowDates = $WindowEnd;
    }
 


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

    if(count($extraCCEmail)>0){
        foreach($extraCCEmail as $ccemail=> $ccname ){
            $mail->addCC($ccemail, $ccname);
        }
    }

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
    $mail->Subject = "Audit Schedule - $ProgramName - $FactoryName - $AuditStartDate"; //$AuditStartDate

    $bodyHTML    = "<span>Hello Auditor(s),</span>
                    <p>Please find below details of your audit assignment.</p>
                    <table border='1'>
                    <tr>
                        <td>Coordinator</td>
                        <td>$CoordinatorName</td>
                        <td>Client</td>
                        <td>$BuyerName</td>
                    </tr>
                    <tr>
                        <td>Audit Date</td>
                        <td>$AuditStartEndDate</td>
                        <td>Program</td>
                        <td>$ProgramName</td>
                    </tr>
                    <tr>
                        <td>Assessment No.</td>
                        <td>$AssessmentNo</td>
                        <td>Audit Stage</td>
                        <td>$AuditStageName</td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td>$State</td>
                        <td>Manday(s)</td>
                        <td>$ManDay</td>
                    </tr>
                    <tr>
                        <td>Business Type</td>
                        <td>$Remarks</td>
                        <td>Status</td>
                        <td>$LeadStatusName</td>
                    </tr>
                    <tr>
                        <td>Auditor Name (Lead)</td>
                        <td>$LeadAuditorName</td>
                        <td>Window</td>
                        <td>$WindowDates</td>
                    </tr>
                    <tr>
                        <td>Auditor Name (Team)</td>
                        <td>$TeamAuditorNames</td>
                        <td>Factory Name</td>
                        <td>$FactoryName</td>
                    </tr>
                    <tr>
                        <td>Report Writer</td>
                        <td>$ReportWriterName</td>
                        <td>Factory Location/Address</td>
                        <td>$FactoryAddress</td>
                    </tr>
                    <tr>
                        <td>Contact Person Phone</td>
                        <td>$FactoryContactPersonPhone</td>
                        <td>Contact Person</td>
                        <td>$FactoryContactPerson</td>
                    </tr>
                    <tr>
                        <td>Contact Person Email</td>
                        <td>$FactoryContactPersonEmail</td>
                        <td>Country</td>
                        <td>$CountryName</td>
                    </tr>
                    <tr>
                        <td>Factory Weekend</td>
                        <td>$FactoryHoliday</td>
                        <td></td>
                        <td></td>
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
