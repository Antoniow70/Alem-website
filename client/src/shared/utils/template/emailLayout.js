/**
 * Layout HTML base para e-mails institucionais da ALEM.
 * Utiliza cores oficiais do website da ALEM.
 * 
 * @param {string} contentHtml - O conteudo principal em HTML
 * @param {string} previewText - Texto de pre-visualizacao (preheader)
 * @returns {string} HTML completo do e-mail
 */
export function getEmailLayout(contentHtml, previewText = 'Associacao ALEM') {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ALEM</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F4F6F8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
      .content-padding {
        padding: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <!-- Preheader Text -->
  <span style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; font-size: 0px; line-height: 0px;">
    ${previewText}
  </span>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F6F8; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px width) -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #1B314C; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 2px;">ALEM</h1>
              <p style="margin: 4px 0 0 0; color: #789ACA; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Associacao de Luta e Esperanca de Mocambique</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td class="content-padding" style="padding: 40px; color: #334155; font-size: 15px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #1B314C; padding: 32px 24px; color: #9FB3C8; font-size: 12px; line-height: 1.5; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0 0 8px 0; color: #ffffff; font-weight: bold; font-size: 14px;">ALEM</p>
              <p style="margin: 0 0 16px 0;">
                Bairro de Macuti, Beira, Mocambique<br>
                Telefones: +258 84 000 0000 | +258 87 000 0000<br>
                E-mails: info@alem.mz | apoio@alem.mz
              </p>
              <div style="margin-bottom: 16px; border-top: 1px solid #3C5E82; width: 60px; height: 1px; display: inline-block;"></div>
              <p style="margin: 0; font-size: 11px; color: #9FB3C8;">
                Esta e uma mensagem automatica de confirmacao de envio. Por favor, nao responda diretamente a este e-mail.
              </p>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #789ACA;">
                &copy; ${currentYear} ALEM. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
