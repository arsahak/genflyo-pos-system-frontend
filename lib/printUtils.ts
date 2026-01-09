export function printBarcode(
  barcode: string,
  productName: string,
  sku: string
) {
  const win = window.open("", "", "width=600,height=600");
  if (!win) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Barcode - ${productName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            padding: 40px;
            margin: 0;
          }
          .container {
            border: 1px dashed #ccc;
            padding: 20px;
            display: inline-block;
            border-radius: 8px;
          }
          .product-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            margin-top: 0;
            color: #000;
          }
          .sku {
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
          }
          svg {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          @media print {
            .container {
              border: none;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="product-name">${productName}</h2>
          <div class="sku">SKU: ${sku}</div>
          <svg id="barcode"></svg>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          try {
            JsBarcode("#barcode", "${barcode}", {
              format: "EAN13",
              displayValue: true,
              fontSize: 20,
              margin: 10,
              height: 60,
              width: 2
            });
            // Small delay to ensure rendering
            setTimeout(function() {
              window.print();
              // Optional: close after print
              // window.onfocus = function() { window.close(); }
            }, 500);
          } catch (e) {
            document.body.innerHTML += '<p style="color:red">Error rendering barcode: ' + e.message + '</p>';
          }
        </script>
      </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
}
