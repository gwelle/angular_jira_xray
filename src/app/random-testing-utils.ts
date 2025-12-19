import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";

/**
 * Génère une chaîne de caractères aléatoire  (ex : "aZxYbCdE")
 * @param {*} length 
 * @param {*} charset 
 * @returns string
 */
export function randomString(length: any = 8, charset: any = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return str;
}

/**
 * Génère un email unique (ex : "qsdfrt.abcd123@gmail.com") 
 * @param {*} domain 
 * @returns string
 */
export function randomEmail(domain: any = 'gmail.com'): string {
  const local = randomString(6).toLowerCase();
  const uniq = Math.random().toString(36).substring(2, 10); // suffixe unique
  return `${local}.${uniq}@${domain}`;
}

/**
 * Génère un mot de passe robuste (ex : "Xy8$trQ!mn2")
 * @param {*} minLength 
 * @param {*} maxLength 
 * @returns string
 */
export function randomPassword(minLength: any = 8, maxLength: any = 15) : string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+=-';
  const all = upper + lower + digits + symbols;

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;

  let pwd = '';
  do {
    const length = Math.floor(Math.random() * (15 - 8 + 1)) + 8; // longueur entre 8 et 15
    pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += all.charAt(Math.floor(Math.random() * all.length));
    }
  } 
  while (!regex.test(pwd));

  return pwd;
}

/**
 * Génère un couple mot de passe + confirmation
 * @param {*} length 
 * @returns { plainPassword: string; confirmationPassword: string }
 */
export function randomPasswordPair(length: any = 8) : { plainPassword: string; confirmationPassword: string } {

  const pwd = randomPassword(length);

  // Vérification immédiate et stricte
  if (!pwd || typeof pwd !== 'string') {
    throw new Error('[ERREUR] Mot de passe invalide généré');
  }

  const pair = {
    plainPassword: pwd.trim(),
    confirmationPassword: pwd.trim(), // on s’assure qu’ils sont *strictement* identiques
  };

  // Double vérification
  if (pair.plainPassword !== pair.confirmationPassword) {
    throw new Error('Les mots de passe ne correspondent pas — test interrompu');
  }

  return pair;
}

/**
 * Crée un formulaire réactif avec des données utilisateur aléatoires
 * @returns FormGroup
 */
export function createFakeForm() : FormGroup { 
  const formBuilder = new FormBuilder();
  const { plainPassword, confirmationPassword } = randomPasswordPair();
  return formBuilder.group({
    email: randomEmail(),
    plainPassword: plainPassword,
    confirmationPassword: confirmationPassword,
    firstName: randomString(),
    lastName: randomString(),
  }); 
}

/** 
 * Récupère un contrôle de formulaire par son nom
 * @param form 
 * @param controlName 
 * @returns AbstractControl
 */
export function getControl(form: any, controlName: string) : AbstractControl {
  return form.get(controlName) as AbstractControl;
}

/** 
 * Définit une erreur backend sur un contrôle de formulaire
 * @param control 
 * @param errorMessage 
 * @returns void
 */
export function setBackendError(control: AbstractControl, errorMessage: string): void {
  control.setErrors({ backend: errorMessage });
}