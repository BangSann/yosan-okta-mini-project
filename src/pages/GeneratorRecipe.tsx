import { useEffect, useState } from "react";
import writeImageInCanvas from "../helper/imageRenderer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import stringSpliter from "../helper/stringSpliter";

const GeneratorRecipe = () => {
  const [recipeImage, setRecipeImage] = useState("");
  const [recipeResponse, setRecipeResponses] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //initialize AI
  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GENERATIVE_AI_API_KEY
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  //initialize AI

  useEffect(() => {
    if (recipeImage) {
      handelCanvasInChange();
    }
  }, [recipeImage]);

  function handelCanvasInChange() {
    writeImageInCanvas(recipeImage , "canvasRecipeImage")
    setIsImage(true);
  }

  function handleGenerateRecipe() {
    setIsLoading(true);
    const prompt =
      "Create a food recipe from this picture, add a name, instructions, and ingredients.";
    const reader = new FileReader();
    reader.readAsDataURL(recipeImage as never);

    reader.onload = async () => {
      const path = reader.result as string;

      const mimeType = recipeImage?.type;
      const data64 = path.split(",")[1];

      const res = model.generateContent([
        prompt,
        { inlineData: { data: data64, mimeType: mimeType } },
      ]);
      setRecipeResponses((await res).response.text());
      setIsLoading(false);

      console.log(recipeResponse);
    };
  }

  return (
    <section className="w-full flex justify-center mt-14">
      <div className="container p-2 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">
            Your images will become your recipes
          </h1>
          <p className="text-xl">
            <span className="font-medium">Note</span> : The results from this
            recipe generator may not be 100% accurate, so please scrutinize and
            consider them.
          </p>
        </div>
        <div className="flex lg:flex-row lg:gap-0 flex-col gap-6">
          <div className="flex flex-col gap-4 ">
            <input
              onChange={(event: any) => setRecipeImage(event.target.files[0])}
              type="file"
              id="recipeImageUpload"
              className="hidden"
            />
            <div className=" lg:w-[400px] h-[400px] w-full ">
              <canvas
                id="canvasRecipeImage"
                className={`${!isImage ? "hidden" : ""} w-full h-full`}
              ></canvas>
              <button
                onClick={() =>
                  document.getElementById("recipeImageUpload")?.click()
                }
                className={`w-full h-full flex  ${
                  isImage ? "hidden" : "flex"
                } items-center justify-center bg-slate-200 text-2xl font-semibold text-white hover:bg-slate-300 rounded-lg`}
              >
                <div className="px-4 py-2 border rounded-md border-white">
                  Choose Image
                </div>
              </button>
            </div>
            <button
              onClick={handleGenerateRecipe}
              className={`btn w-full rounded-lg py-2 bg-[#FFD600] text-[24px] font-semibold text-white`}
              disabled={recipeImage ? false : true}
            >
              Generate Recipe
            </button>
            {isImage ? (
              <button
                onClick={() => {
                  setIsImage(false);
                  setRecipeImage("");
                  setRecipeResponses("");
                }}
                className="btn w-full rounded-lg py-2 bg-red-400 text-[24px] font-semibold text-white"
              >
                Drop Image
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="lg:w-[70%] w-full lg:ps-5">
            {recipeResponse && !isLoading ? (
              <div className="w-full min-h-[100vh]">
                {stringSpliter(recipeResponse).map((item, i) => {
                  if (item == "Ingredients:" || item == "Instructions:" || item == "Enjoy!") {
                    return (
                      <h1 key={i} className="text-xl font-semibold my-4">
                        {item}
                      </h1>
                    );
                  } else if (i == 1) {
                    return (
                      <h1 key={i} className="text-3xl font-semibold">
                        {item}
                      </h1>
                    );
                  } else {
                    return <p key={i}>{item}</p>;
                  }
                })}
              </div>
            ) : (
              <div className="bg-slate-200 w-full min-h-[100vh] flex items-center justify-center text-2xl font-semibold text-white rounded-lg">
                {isLoading ? (
                  <span className="loading loading-spinner loading-lg"></span>
                ) : (
                  "Your recipe will be made here"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratorRecipe;
