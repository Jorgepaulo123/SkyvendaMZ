import React, { useContext } from "react";
import { VerificationStatus } from "./ui/VerificationStatus";
import { AuthContext } from "../../context/AuthContext";
import VerificationSkeleton from "./ui/VerificationSkeleton";
import { useNavigate } from "react-router-dom";

export default function Form_Perfil() {
    const { user,isAuthenticated } = useContext(AuthContext);
    const navigate=useNavigate()

    // Se `user` não estiver disponível, exibe um carregamento ou nada
    if (!user) {
        return <div className="w-full">
            <VerificationSkeleton/>
        </div>
    }

    // Renderiza a interface com o estado de revisão do usuário
    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-4">
            <VerificationStatus estadoRevisao={user.revisado} />
        </div>
    );
}
