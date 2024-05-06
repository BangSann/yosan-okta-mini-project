export default function stringSpliter(data: string) {
  const splitedString: string[] = [];
  const splited = data.split("**");
  splited.map((item) => {
    item.split("*").map((item2) => {
      item2.split(/\d+\./).map((item3) => {
        splitedString.push(item3);
      });
    });
  });

  return splitedString;
}
