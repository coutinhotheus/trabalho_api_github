import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi'; // feather icons
import api from '../../services/api';
//import logoImg from '../../assets/logo.svg';
import { Form, Title, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>([]);

    useEffect(() =>{
        const repositories =localStorage.getItem('@GithubExplorer:repositories')
        if (repositories) {
            setRepositories(JSON.parse(repositories));
        }
    },[]);

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories), );

    }, [repositories]);

    async function handleAddRepository(e: FormEvent<HTMLFormElement>,): Promise<void> {
        e.preventDefault();

        if (!newRepo) {
            setInputError('Digite a placa cadastrada');
            return;
        }

        try {

        const response = await api.get<Repository>(`repos/${newRepo}`);
        const repository = response.data;
        setRepositories([...repositories, repository]);
        setNewRepo('');
        setInputError('');
        console.log(response.data);

    } catch(err){
        setInputError('Erro na busca por esse veiculo');
    }


        // adição de um novo reositorio
        // consumir a api do github
        // salvar novo repositorio no estado
     }
    //<img src={logoImg} alt='Github explorer' />
    return (
    <>

     <Title> Busque o hitórico do veiculo  </Title>
     <Form onSubmit={handleAddRepository}>
       <input
       value={newRepo}
       onChange={ e => setNewRepo(e.target.value)}
       placeholder="Digite a placa do veiculo"
       />
       <button type="submit"> Pesquisar</button>
     </Form>

     {inputError &&<Error>{inputError}</Error>}
     <Repositories>
         {repositories.map(repository => (
              <a key={repository.full_name} href= "teste">
              <img src= {repository.owner.avatar_url}
               alt= {repository.owner.login}
               />
              <div>
                  <strong>{repository.full_name}</strong>
                  <p>
                      {repository.description}
                  </p>
              </div>
              <FiChevronRight size={20} />
              </a>

    ))}

     </Repositories>
    </>
    );
};

export default Dashboard;
