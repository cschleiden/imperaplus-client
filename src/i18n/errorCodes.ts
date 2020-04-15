import __ from "./i18n";

export const getErrorMessage = (errorCode: string): string | undefined => {
    switch (errorCode) {
        // Account
        case "UsernameOrPasswordNotCorrect":
            return __(
                "Username or password is not correct, did you [forget your password](/reset)?"
            );
        case "AccountIsLocked":
            return __(
                `This account is locked, please try to <a ui-sref="public.account.unlockAccount">unlock</a> it.`
            );
        case "AccountNotConfirmed":
            return __(
                `This account has not been confirmed yet, please click the link in the confirmation email to activate, or request a new <a ui-sref="public.account.resendConfirmation">confirmation code</a>.`
            );

        case "EmailAlreadyInUse":
            return __("This email address is already linked to an account.");
        case "UserWithExternalLoginExists":
            return __("This login is already linked to an account.");
        case "UserIdNotFound":
            return __("The user id cannot be found.");
        case "UsernameInvalid":
            return __(
                "Username is invalid, it may only contain characters and numbers."
            );
        case "EmailInvalid":
            return __("Email address is invalid.");
        case "PasswordInvalid":
            return __(
                "Password is invalid, it has to be at least 8 characters long."
            );
        case "PasswordsDoNotMatch":
            return __("Passwords do not match.");
        case "UserAlreadyInRole":
            return __("User is already in this role.");
        case "UserNotInRole":
            return __("User is not in role.");
        case "UserDoesNotExist":
            return __("User does not exist.");
        case "InvalidToken":
            return __("Invalid token.");
        case "UsernameAlreadyInUse":
            return __("Username is already linked to an account.");
        case "ExternalLoginFailure":
            return __("Cannot login with this login.");

        // Generic
        case "GenericError":
            return __("An error has occured.");

        // Game
        case "CannotStartGame":
            return __("Cannot start the game.");
        case "NameAlreadyTaken":
            return __("This name is already in use.");
        case "TeamAlreadyFull":
            return __("Team is already full.");
        case "GamePasswordNotCorrect":
            return __(
                "Game is password protected and the given password is not correct"
            );
    }

    return undefined;
};
