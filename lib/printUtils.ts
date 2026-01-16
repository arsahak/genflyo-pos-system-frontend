export function printBarcode(
  barcode: string,
  productName: string,
  price: number
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
            padding: 10px 15px;
            display: inline-block;
            border-radius: 6px;
          }
          .product-name {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 2px;
            margin-top: 0;
            color: #000;
          }
          .price {
            font-size: 11px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
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
          <div class="price">MRP: ৳${price.toFixed(2)}</div>
          <svg id="barcode"></svg>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          try {
            JsBarcode("#barcode", "${barcode}", {
              format: "EAN13",
              displayValue: true,
              fontSize: 14,
              margin: 5,
              height: 50,
              width: 1.5
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
