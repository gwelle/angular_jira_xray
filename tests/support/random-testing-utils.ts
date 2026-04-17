
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
 * Génère un prénom fictif (ex : "Julien")
 * @param {*} length 
 * @returns 
 */
export function randomFirstName(length = 6) {
  const name = randomString(length).toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Génère un nom fictif (ex : "Trivako")
 * @param {*} length 
 * @returns 
 */
export function randomLastName(length = 8) {
  const name = randomString(length).toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
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