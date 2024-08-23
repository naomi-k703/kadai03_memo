// レベルアップの進捗バーを更新する関数
function updateProgressBar(currentScore, maxScore) {
    const progressPercentage = (currentScore / maxScore) * 100;
    document.getElementById('progressBarFill').style.width = `${progressPercentage}%`;
}

// レベルアップ時の特別なメッセージを表示する関数
function showSpecialMessage(currentLevel, nextLevel) {
    const messageContainer = document.getElementById('specialMessage');
    if (currentLevel < nextLevel) {
        messageContainer.querySelector('p').textContent = "素晴らしい成長！次のレベルまであと少し！";
    } else {
        messageContainer.querySelector('p').textContent = "おめでとう！レベルアップしました！";
        // バッジや称号の追加処理
        addBadgeToUser(currentLevel + 1);
    }
}

// バッジをユーザーに追加する関数
function addBadgeToUser(level) {
    const badgeContainer = document.getElementById('milestones');
    const newBadge = document.createElement('div');
    newBadge.className = 'badge';
    newBadge.textContent = `Level ${level} Badge`;
    badgeContainer.appendChild(newBadge);
}

// 言語を設定する関数
function setLanguage(language) {
    const elements = document.querySelectorAll('[data-lang-en], [data-lang-zh], [data-lang-ja]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-lang-${language}`);
    });
}

// 初期状態で日本語を表示
setLanguage('ja');

// セクション切り替え
function showSection(sectionToShow) {
    document.querySelectorAll('.container').forEach(section => {
        section.style.display = 'none';
    });
    sectionToShow.style.display = 'block';
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // セクションの初期表示設定
    showSection(document.getElementById('registerSection'));
});

// ユーザー登録
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    alert('ユーザー登録が完了しました！ログインしてください。');
    showSection(document.getElementById('loginSection'));
});

// ログイン
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (loginUsername === storedUsername && loginPassword === storedPassword) {
        alert('ログイン成功！');
        showSection(document.getElementById('section1'));
        document.querySelector('.progress-bar').style.display = 'block'; // プログレスバーを表示
    } else {
        alert('ユーザー名またはパスワードが正しくありません😭');
    }
});

// 質問の切り替えと進捗バーの更新
let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question');
const progress = document.getElementById('progress');

document.querySelectorAll('.question input').forEach(input => {
    input.addEventListener('change', function() {
        questions[currentQuestionIndex].style.display = 'none';
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            questions[currentQuestionIndex].style.display = 'block';
            progress.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
        } else {
            document.getElementById('submitButton').style.display = 'block';
        }
    });
});

// 診断結果の処理
document.getElementById('diagnosisForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    let tasks = [];
    let score = 0;

    // 設問に基づくアドバイス生成とスコア計算
    const questionsMap = {
        goalSetting: { message: '目標がもっと明確になると、毎日の行動がさらに充実するよ😃！', points: 1 },
        goalDefinition: { message: 'ゴールがしっかりと定まると、目標達成がさらに楽しくなるよ！✨。', points: 1 },
        actionPlan: { message: '行動計画がしっかりしていると、毎日がもっとスムーズになるから実践してみたらいいよ🎵！✨', points: 1 },
        prioritization: { message: '優先順位が明確になると、重要なことに集中できるから実践してみて😻！', points: 1 },
        taskManagement: { message: 'タスクを整理しておくと、毎日の流れがもっとスムーズになるね🤩', points: 1 },
        timeEfficiency: { message: '時間を効率的に使えると、さらに余裕を感じられていいよね！', points: 1 },
        taskExecution: { message: '計画通りにタスクを進めると、達成感が増すから、もっと自信がつくはず💪✨', points: 1 },
        productivityHindrance: { message: '生産性を妨げる要因を取り除くと、集中力が高まる🔥✨', points: 1 },
        progressCheck: { message: '進捗を定期的に確認すると、達成度が見えてくる！', points: 1 },
        planAdjustment: { message: '計画を柔軟に調整すると、行動が取りやすくなるから、実践してみて！💖', points: 1 },
        feedbackImprovement: { message: 'フィードバックを活かすことで、成長がさらに実感できるようになるよ🌟', points: 1 }
    };

    for (const [key, data] of Object.entries(questionsMap)) {
        if (formData.get(key) === 'no') {
            tasks.push(data.message);
            score += data.points;
        }
    }

    // スコアに基づくレベル判定
    let level;
    if (score >= 9) {
        level = 1; // Assistant.Maneger
    } else if (score >= 7) {
        level = 2; // Jr.Maneger
    } else if (score >= 5) {
        level = 3; // Standard.Maneger
    } else if (score >= 3) {
        level = 4; // General.Maneger
    } else {
        level = 5; // Master.Maneger
    }

    displayResults(level, tasks);

    // 診断結果後に次のセクションを表示
    showSection(document.getElementById('section2'));

     // ↓↓↓タスク管理のセクションを非表示にする↓↓↓
     document.getElementById('section2').style.display = 'none';
    
    // 診断結果のセクションを表示
    document.getElementById('section1').style.display = 'block';
});

    // ↓↓↓タスク管理のセクションを非表示にする↓↓↓
    document.getElementById('section2').style.display = 'none';


function displayResults(level, steps) {
    const levelNames = ["Assistant.Maneger", "Jr.Maneger", "Standard.Maneger", "General.Maneger", "Master.Maneger"];
    const characterImages = ["/img/step1.png", "/img/step2.png", "/img/step3.png", "/img/step4.png", "/img/step5.png"];
    
    const levelDescriptions = [
        "step1:頑張ってるね！タイムマネジメントの基礎を学んでいる段階！✨",
        "step2:素晴らしい！タイムマネジメントの基本を理解し始めているね🤩",
        "step3:いいね！計画を立て、タスクをこなすことができるようになってきてるね🎵",
        "step4:すごい！タイムマネジメントがほぼ自走してる🌟！！",
        "step5:さすが！タイムマネジメントの全ての要素をマスターできてる〜😻✨"
    ];

    document.getElementById('level').textContent = levelNames[level - 1];
    document.getElementById('character').src = characterImages[level - 1];
    document.getElementById('description').textContent = levelDescriptions[level - 1];

    const improvementSteps = document.getElementById('improvementSteps');
    improvementSteps.innerHTML = "";
    steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        improvementSteps.appendChild(li);
    });

    document.getElementById('result').style.display = 'block';
}

// タスク管理機能
const taskList = [];
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // タスクの詳細を取得
    const taskName = document.getElementById('taskInput').value.trim();
    const urgency = parseInt(document.getElementById('urgency').value);
    const importance = parseInt(document.getElementById('importance').value);
    const taskDate = document.getElementById('taskDate').value;

    if (taskName && taskDate) {
        const newTask = {
            name: taskName,
            urgency: urgency,
            importance: importance,
            date: taskDate,
            priority: urgency + importance,
            done: false
        };
        taskList.push(newTask);
        updateTaskList();
        document.getElementById('taskInput').value = '';
        document.getElementById('taskDate').value = '';
        addToGoogleCalendar(newTask);
    }
});

// タスクリストの表示更新
function updateTaskList() {
    const taskUl = document.getElementById('taskList');
    taskUl.innerHTML = '';
    taskList.sort((a, b) => b.priority - a.priority);

    taskList.forEach((task, index) => {
        const taskLi = document.createElement('li');
        taskLi.innerHTML = `${task.name} [緊急度: ${task.urgency} 重要度: ${task.importance} 日付: ${task.date}]`;

        // タスクの削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = function() {
            taskList.splice(index, 1);
            updateTaskList();
        };

        // タスクの完了ボタン
        const doneButton = document.createElement('button');
        doneButton.textContent = task.done ? '未完了' : '完了';
        doneButton.onclick = function() {
            task.done = !task.done;
            updateTaskList();
        };

        taskLi.appendChild(doneButton);
        taskLi.appendChild(deleteButton);
        taskUl.appendChild(taskLi);
    });
}

// Googleカレンダーにタスクを追加する（ダミー関数）
function addToGoogleCalendar(task) {
    console.log(`タスクをGoogleカレンダーに追加: ${task.name}, 日付: ${task.date}`);
}

// 振り返り機能の保存
document.getElementById('saveReflection').addEventListener('click', function() {
    const reflectionText = document.getElementById('weeklyReflection').value;
    if (reflectionText) {
        localStorage.setItem('weeklyReflection', reflectionText);
        displayMascotMessage();
    }
});

// マスコットの応援メッセージ表示
function displayMascotMessage() {
    const reflectionText = localStorage.getItem('weeklyReflection');
    const mascotMessageDiv = document.getElementById('mascotMessage');
    if (reflectionText) {
        const messages = [
            '今週もお疲れ様！よく頑張ったね✨',
            '素晴らしい成果！来週も引き続き頑張ろう！！📣',
            'あなたの努力が実を結んでるね！継続が大事💪✨',
            '頑張りを感じるよ✨次のステップに進もう！！✨',
            'この調子！！さらなる成長を目指していこう🔥応援してる✨'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        mascotMessageDiv.textContent = randomMessage;
    } else {
        mascotMessageDiv.textContent = '振り返りを記入して、マスコットからのメッセージを受け取りましょう！';
    }
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    displayMascotMessage();
});

// フォーム切り替えボタンの設定
document.getElementById('showLoginForm').addEventListener('click', function() {
    showSection(document.getElementById('loginSection'));
});

document.getElementById('showRegisterForm').addEventListener('click', function() {
    showSection(document.getElementById('registerSection'));
});

// ダッシュボードとレーダーチャート機能
document.getElementById('toDashboard').addEventListener('click', function() {
    showSection(document.getElementById('dashboardSection'));
    renderRadarChart();
});



// "振り返りへ" ボタンがクリックされたときの処理
document.getElementById('toSection3').addEventListener('click', function() {
    // 振り返りのセクションに移動
    showSection(document.getElementById('section3'));
});

// レーダーチャートを描画する関数
function renderRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['目標設定', 'アクションプラン', 'タスク管理', '時間効率', '振り返り'],
            datasets: [{
                label: '現在の成長レベル',
                data: data,  // ここに診断結果から生成したデータを入力
                backgroundColor: 'rgba(214, 107, 125, 0.2)',
                borderColor: 'rgba(214, 107, 125, 1)',
                pointBackgroundColor: 'rgba(214, 107, 125, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(214, 107, 125, 1)'
            }]
        },
        options: {
            scale: {
                ticks: { beginAtZero: true, max: 5 },
                pointLabels: { fontSize: 14, fontColor: '#333' }
            }
        }
    });
}

// 診断結果の処理
document.getElementById('diagnosisForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 診断結果の計算ロジック（ここはすでにあるはず）
    const currentScore = 50;  // 実際にはユーザーの診断結果に基づくスコア
    const maxScore = 100;  // レベルアップに必要な最大スコア
    const currentLevel = 1;  // 仮のレベル。実際にはユーザーデータから取得
    const nextLevel = 2;  // 仮の次のレベル

    // 進捗バーを更新
    updateProgressBar(currentScore, maxScore);

    // チャートを描画する
    const radarData = [4, 3, 5, 2, 4];  // これは仮のデータ。実際にはユーザーの診断結果を使う
    renderRadarChart(radarData);

    // 特別なメッセージを表示
    showSpecialMessage(currentLevel, nextLevel);

    // 診断結果後に次のセクションを表示
    showSection(document.getElementById('section2'));

    // 診断結果のセクションを表示
    document.getElementById('section1').style.display = 'block';
});


