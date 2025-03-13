$(document).ready(function () {
    // Sayfa yüklendiğinde görevleri çek ve listeye ekle
    function loadTasks() {
        $.get("http://localhost:5000/tasks", function (tasks) {
            $("#taskList").empty();

            tasks.forEach(task => {
                 // Görevin tamamlanıp tamamlanmadığını kontrol et
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

    // Filtreleme butonlarına tıklanınca çalışacak
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

    // Görev ekleme
    $("#addTaskBtn").click(function () {
        let taskText = $("#taskInput").val().trim();
        if (taskText === "") return;

        $.post("/tasks", { text: taskText }, function (newTask) {
            location.reload();
        });
    });

    // Görevi tamamlama
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

    // Görev düzenleme
    $(document).on("click", ".editTask", function () {
        let taskId = $(this).closest("li").data("id");
        let newText = prompt("Yeni görev adı:");
        if (!newText) return;

        $.ajax({
            url: `/tasks/${taskId}`,
            type: "PUT",
            data: { text: newText },
            success: function () {
                location.reload();
            }
        });
    });

    // Görev silme
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

    // Yapılan görevleri sil
    $("#clearCompleted").click(function () {
        $.ajax({
            url: "/tasks/clear-completed",
            type: "DELETE",
            success: function () {
                location.reload();
            }
        });
    });

    // Tüm görevleri sil
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
