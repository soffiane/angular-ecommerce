import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors | null | undefined {
        //on verifie si la valeur est null ou undefined
        if(control.value != null && typeof control.value === 'string') {
            //on supprime les espaces avant et après la valeur
            if(control.value.trim().length === 0) {
                //la validation echoue, on retourne un objet avec la clé 'notOnlyWhitespace' et la valeur true
                return { 'notOnlyWhitespace': true };
            }
            //la validation reussie, on retourne null
            return null;
        }
        return undefined;
    }
}
