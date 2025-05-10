import {useNavigate} from "react-router-dom";

export default function RoleSelectPage() {
    const navigate = useNavigate();

    const onSelectTeacher = () => {
        navigate('/login');
    };
    const onSelectStudent = () => {
        navigate('/student');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Выберите роль</h1>

            <div className="grid grid-cols-2 gap-8">
                <button
                    onClick={onSelectTeacher}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl hover:bg-blue-700 transition"
                >
                    Я — преподаватель
                </button>

                <button
                    onClick={onSelectStudent}
                    className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition"
                >
                    Я — ученик
                </button>
            </div>
        </div>
    );
}