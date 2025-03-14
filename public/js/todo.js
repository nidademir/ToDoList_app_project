$(document).ready(function () {
    function loadTasks() {
        $.get("/tasks", function (tasks) {
            $("#taskList").empty();

            tasks.forEach(task => {
                const taskClass = task.completed ? 'completed' : '';
                const checked = task.completed ? 'checked' : '';
                $("#taskList").append(`
                    <li data-id="${task.id}">
                        <input type="checkbox" id="task_<%= task.id %>" name="task_<%= task.id %>" class="completeTask" <% if (task.completed) { %>checked<% } %>>
                        <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                        <button class="editTask"><i class="fa-solid fa-pencil"></i></button>
                        <button class="deleteTask"><i class="fa-solid fa-trash"></i></button>
                    </li>
                `);
            });
        });
    }

    $(".filter-btn").click(function () {
        let filter = $(this).data("filter");

        $("#taskList li").each(function () {
            let isCompleted = $(this).find(".completeTask").prop("checked");

            if (filter === "all") {
                $(this).show();
            } else if (filter === "done" && isCompleted) {
                $(this).show();
            } else if (filter === "todo" && !isCompleted) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    $(".filter-btn").click(function () {
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
    });

    $("#addTaskBtn").click(function () {
        let taskText = $("#taskInput").val().trim();
        if (taskText === "") return;

        $.post("/tasks", { text: taskText }, function (newTask) {
            location.reload();
        });
    });


    $(document).on("click", ".editTask", function () {
        let listItem = $(this).closest("li");
        let taskId = listItem.data("id");
        let taskText = listItem.find("span").text();

        listItem.find("span").hide();
        listItem.find(".editTask").hide();

        if (listItem.find(".editInput").length === 0) {
            listItem.append(`<input type="text" class="editInput" id="editTask_${taskId}" name="editTask" value="${taskText}">`);
            listItem.append(`<button class="saveEdit"><i class="fa-solid fa-check" id="saveEdit"></i></button>`);
        }
    });

    $(document).on("click", ".saveEdit", function () {
        let listItem = $(this).closest("li");
        let taskId = listItem.data("id");
        let newText = listItem.find(".editInput").val();

        if (!newText) return;

        $.ajax({
            url: `/tasks/${taskId}`,
            type: "PUT",
            data: { text: newText },
            success: function () {
                listItem.find("span").text(newText).show();
                listItem.find(".editTask").show();
                listItem.find(".editInput").remove();
                listItem.find(".saveEdit").remove();
            }
        });
    });

    $(document).on("change", ".completeTask", function () {
        let taskId = $(this).closest("li").data("id");
        let completed = $(this).prop("checked");

        $.ajax({
            url: `/tasks/${taskId}`,
            type: "PUT",
            data: JSON.stringify({ completed }),
            contentType: "application/json",
            success: function () {
                location.reload();
            }
        });
    });


    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".editTask").forEach(button => {
            button.addEventListener("click", function () {
                let listItem = this.closest(".task-item"); 
                let textSpan = listItem.querySelector(".task-text"); 
                let editInput = listItem.querySelector(".editInput");
                let saveButton = listItem.querySelector(".saveTask"); 

                textSpan.style.display = "none"; 
                editInput.style.display = "inline-block";
                saveButton.style.display = "inline-block";
                this.style.display = "none";
            });
        });

        document.querySelectorAll(".saveTask").forEach(button => {
            button.addEventListener("click", function () {
                let listItem = this.closest(".task-item");
                let textSpan = listItem.querySelector(".task-text");
                let editInput = listItem.querySelector(".editInput");
                let editButton = listItem.querySelector(".editTask");

                textSpan.textContent = editInput.value; 
                textSpan.style.display = "inline-block";
                editInput.style.display = "none"; 
                this.style.display = "none";
                editButton.style.display = "inline-block";
            });
        });
    });


    $(document).on("click", ".deleteTask", function () {
        let taskId = $(this).closest("li").data("id");

        $.ajax({
            url: `/tasks/${taskId}`,
            type: "DELETE",
            success: function () {
                location.reload();
            }
        });
    });

    $("#clearAll").click(function () {
        $.ajax({
            url: "/tasks",
            type: "DELETE",
            success: function () {
                location.reload();
            }
        });
    });
});
