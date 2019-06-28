import helpCommand                                                  from "./help/index";
import pingCommand                                                  from "./ping";
import { toggleVerificationCommand }                                from "./joinVerification";
import { banCommand, unbanCommand }                                 from "./ban";
import { backupCommand, doApplyBackupCommand, dropDBBackupCommand } from "./backup";
import { addBadWordCommand }                                        from "./messageFilter/badWord/addBadWord";
import { resetBadWordsCommand }                                     from "./messageFilter/badWord/resetBadWord";
import { badWordListCommand }                                       from "./messageFilter/badWord/badWordList";
import { kickCommand }                                              from "./kick";
import { setBaseRoleCommand }                                       from "./joinVerification/baseRole";
import setNsfwConfig                                                from "./messageFilter/nsfwFilter/updateConfig";
import { giveWarnCommand, warnListCommand }                         from "./warns";
import getOpinion                                                   from "./opinion/get";
import giveOpinion                                                  from "./opinion/give";

export default [addBadWordCommand, resetBadWordsCommand, badWordListCommand, helpCommand, pingCommand, toggleVerificationCommand, banCommand, unbanCommand, backupCommand, doApplyBackupCommand, dropDBBackupCommand, kickCommand, setBaseRoleCommand, setNsfwConfig, giveWarnCommand, warnListCommand, getOpinion, giveOpinion];