exports.testtpls = function(req, res){
var value = [
             {
                 "data": "テンプレート一覧", 
                 "state": "open",
                 "attr" : { "rel" : "root", nid: 1},
                 "children": [
                     {
                         "data": "A", 
                         "state": "open",
                         "attr" : { "rel" : "folder", "nid" : 7},
                         "children": [
                             {
                                 "data": "A-1", 
                                 "state": "open",
                                 "attr" : {"rel" : "folder", nid: 2},
                                 "children": [
                                     {
                                         "children": [
                                             {
                                                 "data": "A-1-1-1",
                                                 "attr" : { "nid" : 13 }
                                             },
                                             {
                                                 "data": "A-1-1-2",
                                                 "attr" : { "nid" : 14 }
                                             },
                                         ], 
                                         "data": "A-1-1", 
                                         "state": "open",
                                         "attr" : { "rel" : "folder", "nid" : 8}
                                     }, 
                                     {
                                         "children": [
                                             {
                                                 "data": "A-1-2-1",
                                                 "attr" : { "nid" : 15 }
                                             }
                                         ], 
                                         "data": "A-1-2", 
                                         "state": "close",
                                         "attr" : { "rel" : "folder", "nid" : 9}
                                     },
                                     {
                                         "data": "A-1-3", 
                                         "attr" : { "rel" : "default", "nid" : 10}
                                     }
                                 ]
                             }, 
                             {
                                 "data": "A-2", 
                                 "state": "close",
                                 "attr" : {"rel" : "folder", "nid" : 3},
                                 "children": [
                                     {
                                         "children": [
                                             {
                                                 "data": "A-2-1-1",
                                                 "attr" : {"nid" : 12}
                                             }
                                         ], 
                                         "data": "A-2-1", 
                                         "state": "open",
                                         "attr" : {"rel" : "folder", "nid" : 11}
                                     }

                                 ],

                             }, 
                             {
                                 "data": "A-3",
                                 "attr" : {"rel" : "default", "nid" : 12}
                             }

                         ]

                     }, 
                     {
                         "children": [
                             {
                                 "data": "B-1",
                                 "attr" : {"rel" : "default", "nid" : 5}
                             }

                         ], 
                         "data": "B", 
                         "state": "open",
                         "attr" : {"rel" : "folder", "nid" : 4}
                     }
                 ]
             }
         ];	
	
	res.send(value);
}
