<?php
// contacto-send.php
mb_internal_encoding('UTF-8');
header('Content-Type: application/json; charset=UTF-8');

// 1) Bloqueo bots (honeypot)
if (!empty($_POST['hp'])) {
  echo json_encode(['ok' => false, 'msg' => 'Spam bloqueado']);
  exit;
}

// 2) Tomo y limpio datos
$nombre   = trim($_POST['nombre'] ?? '');
$email    = trim($_POST['email'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$mensaje  = trim($_POST['mensaje'] ?? '');

// 3) Validación mínima
if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['ok' => false, 'msg' => 'Por favor completá nombre, email válido y mensaje.']);
  exit;
}

// 4) Destino y armado del mail
$destinatario = 'mpcasas@gmail.com'; // <- AQUÍ VA EL MAIL DE TU CLIENTA
$asunto = 'Nuevo mensaje desde marisolperezcasas.com';
$cuerpo = "Nombre: $nombre\n".
          "Email: $email\n".
          "Teléfono: $telefono\n\n".
          "Mensaje:\n$mensaje\n";

// 5) Cabeceras (From del dominio y Reply-To del usuario para evitar spam)
$dominio = $_SERVER['SERVER_NAME'] ?? 'marisolperezcasas.com';
$from = 'no-reply@' . $dominio;
$headers = [];
$headers[] = 'From: ' . $from;
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$enviado = @mail($destinatario, '=?UTF-8?B?'.base64_encode($asunto).'?=', $cuerpo, implode("\r\n", $headers));

if ($enviado) {
  echo json_encode(['ok' => true, 'msg' => '¡Gracias! Tu mensaje fue enviado.']);
} else {
  echo json_encode(['ok' => false, 'msg' => 'No se pudo enviar. Intentá de nuevo más tarde.']);
}
