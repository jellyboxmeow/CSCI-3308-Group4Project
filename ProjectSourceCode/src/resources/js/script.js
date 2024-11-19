
// created forum object for simplicty below is constructor
class Forum {
    constructor({ id, formName, formType, formDescription, formUser, formDate = new Date() }) {
        this.id = id;
        this.formName = formName;
        this.formType = formType;
        this.formDescription = formDescription;
        this.formUser = formUser;
        this.formDate = formDate;
    }
}



//TODO: link addform, updateForm,and  deleteForm  call to implmentation in UI & authentication --note form function are in admin should be moved later

// Add the new forum 
addForm(newForum)
    .then(result => console.log("Forum added:", result))
    .catch(error => console.error("Error adding forum:", error));
// Updates a forum by ID
updateForm(existingForum)
    .then(result => console.log("Forum updated:", result))
    .catch(error => console.error("Error updating forum:", error));
// Delete a forum by ID
deleteForm(2)
    .then(() => console.log("Forum deleted"))
    .catch(error => console.error("Error deleting forum:", error));



    const express = require('express');
    const app = express();
    const db = require('./path/to/your/db'); // Adjust path to your db instance
    const { Forum } = require('./path/to/forum-model'); // Adjust path to Forum class
    const { addForm, updateForm, deleteForm } = require('./path/to/your/forum-functions'); // Adjust as needed
    
    // Test Admin Route for Adding, Updating, and Deleting a Forum
    app.get('/admin/test', async (req, res) => {
        try {
            // 1. Add a new forum
            const newForum = new Forum({
                formName: "Admin Test Forum",
                formType: "Public",
                formDescription: "This forum is created for testing admin functionality.",
                formUser: 1 // Assuming admin has user ID 1
            });
            const addedForum = await addForm(newForum);
            console.log("Added Forum:", addedForum);
    
            // 2. Update the forum
            addedForum.formName = "Updated Admin Test Forum";
            const updatedForum = await updateForm(addedForum);
            console.log("Updated Forum:", updatedForum);
    
            // 3. Delete the forum
            await deleteForm(updatedForum.id);
            console.log("Deleted Forum ID:", updatedForum.id);
    
            res.send("Admin test completed successfully!");
        } catch (error) {
            console.error("Error in admin test route:", error);
            res.status(500).send("Admin test failed");
        }
    });
    
    // Start the server
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
    