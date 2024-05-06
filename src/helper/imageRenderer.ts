// Write image in canvas
export default function writeImageInCanvas(imageFile: string , canvasId : string) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile as never);

    reader.onload = async (event) => {
      var path = event.target?.result as string;
      
      var canvas = document.getElementById(
        canvasId
      ) as HTMLCanvasElement;
      var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const img = new Image();
  
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = path;
    };
  }
  // Write image in canvas