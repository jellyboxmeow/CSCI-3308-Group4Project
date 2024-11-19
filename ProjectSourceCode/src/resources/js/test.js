


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
