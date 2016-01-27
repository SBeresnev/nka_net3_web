/**
 * Created by beresnev on 11.01.2016.
 */

angular.module('assetsApp').value('rightvar',
    {
        begin_date: null,
        bindedObj: {},
        bound_id: null,
        comments: "",
        end_date: null,
        is_needed: 0,
        limit_right: null,
        ooper: {},
        rightOwners: [],
        right_count_type: null,
        right_entity_type: null,
        right_id: null,
        right_type: null,
        status: 1,

        limit_rights:[],
        rightOwner: {owner:{}, parent_owner_obj:{}, limit_rights:[], status:1 },
        right_count_type_name: "",
        right_entity_type_name: "",
        right_type_name: ""
  }
);
