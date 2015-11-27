/**
 * Created by Radkevich on 09.11.2015.
 */

angular.module('assetsApp').value('subjectvar',
    {
        subjectId:null,
        reestrdataID:null,
        isOwner:null,
        subjectType:210,
        dtype:"juridical",
        subjectdataid:null,
        fullname: null,
        shortname:null,
        regNumber:null,
        unp:null,
        orgRightForm: {
            code_id:null,
            analytic_type:210,
            code_name:null,
            code_short_name:null,
            parent_code:null,
            n_prm1:null,
            v_prm1:null,
            unitmeasure:null,
            status:1,
            catalogPk:
            {
                code_id:null,
                analytic_type:220
            }
        },
        sitizens:112,
        bothRegDate:null,
        remark:null,
        address:null
    }

);
