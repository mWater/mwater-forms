
# # Tests related to the entities connections with forms

# describe "Entities", ->
#   describe "EntityQuestion with linked questions", ->
#     before ->
#       # Create an entity question
#       @model = new Backbone.Model()
#       @compiler = new FormCompiler(model: @model, locale: "en")
#       @q = {
#         _id: "q1234"
#         _type: "EntityQuestion"
#         text: { _base: "en", en: "English" }
        
#       }
#       @qview = @compiler.compileQuestion(@q).render()

#     it "selecting entity sets linked empty answer"
#     it "selecting entity does not overwrite linked filled answer"

#   describe "EntityQuestion with answer and linked questions", ->
#     describe "linked question answered", ->
#       it "getEntityUpdates includes update"
#     describe "linked question answered but not visible", ->
#       it "getEntityUpdates does not include update"
#     describe "linked question empty answer", ->
#       it "getEntityUpdates includes update"

#   describe "Entity creation", ->
#     it "fills default answers"
#     it "getEntityCreates returns new entity"

#   describe "Entity updating", ->
#     describe "with entity set", ->
#       it "fills answers with existing properties"
#       describe "linked question answered", ->
#         it "getEntityUpdates includes update"
#       describe "linked question answered but not visible", ->
#         it "getEntityUpdates does not include update"
#       describe "linked question empty answer", ->
#         it "getEntityUpdates includes update"
