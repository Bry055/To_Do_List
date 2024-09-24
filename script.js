// script.js
$(document).ready(function () {
    const API_URL = 'http://localhost:5000/tasks';

    // Função para carregar todas as tarefas
    function loadTasks() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function (tasks) {
                $('#task-list').empty();
                tasks.forEach(task => {
                    $('#task-list').append(`
                        <li data-id="${task.id}">
                            ${task.description}
                            <button class="delete-btn">Excluir</button>
                        </li>
                    `);
                });
            },
            error: function (xhr, status, error) {
                alert('Erro ao carregar tarefas: ' + error);
            }
        });
    }

    // Carregar tarefas ao iniciar
    loadTasks();

    // Adicionar uma nova tarefa
    $('#add-task-btn').click(function () {
        let newTask = $('#new-task').val().trim();
        if (newTask) {
            $.ajax({
                url: API_URL,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ description: newTask }),
                success: function (task) {
                    $('#task-list').prepend(`
                        <li data-id="${task.id}">
                            ${task.description}
                            <button class="delete-btn">Excluir</button>
                        </li>
                    `);
                    $('#new-task').val('');
                },
                error: function (xhr, status, error) {
                    alert('Erro ao adicionar tarefa: ' + xhr.responseJSON.error);
                }
            });
        }
    });

    // Excluir uma tarefa (usando delegação de eventos)
    $('#task-list').on('click', '.delete-btn', function () {
        const li = $(this).closest('li');
        const taskId = li.data('id');

        $.ajax({
            url: `${API_URL}/${taskId}`,
            method: 'DELETE',
            success: function (response) {
                li.remove();
            },
            error: function (xhr, status, error) {
                alert('Erro ao excluir tarefa: ' + xhr.responseJSON.error);
            }
        });
    });
});
