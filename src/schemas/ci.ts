import { z } from "zod";
import { isValid, parse, differenceInYears } from "date-fns";

export const ciSchema = z
  .string()
  .min(1, { message: "Campo obligatorio" })
  .length(11, { message: "El CI debe contener 11 cifras" })
  .superRefine((value, ctx) => {
    if (value.length !== 11) return;
    const era = Number(value.at(6));
    let year = value.slice(0, 2);

    if (era <= 5) year = "19" + year;
    else if (era === 9) year = "18" + year;
    else year = "20" + year;

    const month = value.slice(2, 4);
    const day = value.slice(4, 6);
    const dateStr = year + month + day;
    const date = parse(dateStr, "yyyyMMdd", new Date());
    if (!isValid(date)) {
      ctx.addIssue({
        code: "custom",
        message: "El CI debe contener una fecha válida",
      });
    }

    const age = differenceInYears(new Date(), date);
    if (age < 18 || age > 90) {
      ctx.addIssue({
        code: "custom",
        message: "El rango de edad de militancia permitido es de 18 a 90 años",
      });
    }
  });
