export namespace ErrorCodes {
    export const errorMessage: { [errorCode: string]: string } = {
        // Account
        "UsernameOrPasswordNotCorrect": __("Username or password is not correct, did you [forget your password](/reset)?"),
        "AccountIsLocked": __("This account is locked, please try to <a ui-sref=\"public.account.unlockAccount\">unlock</a> it."),
        "AccountNotConfirmed": __("This account has not been confirmed yet, please click the link in the confirmation email to activate, or request a new <a ui-sref=\"public.account.resendConfirmation\">confirmation code</a>."),

        "EmailAlreadyInUse": __("This email address is already linked to an account."),
        "UserWithExternalLoginExists": __("This login is already linked to an account."),
        "UserIdNotFound": __("The user id cannot be found."),
        "UsernameInvalid": __("Username is invalid, it may only contain characters and numbers."),
        "EmailInvalid": __("Email address is invalid."),
        "PasswordInvalid": __("Password is invalid, it has to be at least 8 characters long."),
        "PasswordsDoNotMatch": __("Passwords do not match."),
        "UserAlreadyInRole": __("User is already in this role."),
        "UserNotInRole": __("User is not in role."),
        "UserDoesNotExist": __("User does not exist."),
        "InvalidToken": __("Invalid token."),
        "UsernameAlreadyInUse": __("Username is already linked to an account."),
        "ExternalLoginFailure": __("Cannot login with this login."),

        // Generic        
        "GenericError": __("An error has occured."),

        // Game
        "CannotStartGame": __("Cannot start the game."),
        "NameAlreadyTaken": __("This name is already in use."),
        "TeamAlreadyFull": __("Team is already full.")
    };
}