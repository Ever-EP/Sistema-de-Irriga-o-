class SistemaIrrigacao {
    constructor() {
        this.intervalo = 2; // horas
        this.ativo = false;
        this.ultimaIrrigacao = null;
        this.proximaIrrigacao = null;
        this.timer = null;

        this.inicializar();
    }

    inicializar() {
        // Elementos do DOM
        this.elementos = {
            intervalo: document.getElementById('intervalo'),
            ativar: document.getElementById('ativar'),
            status: document.getElementById('status'),
            ultimaIrrigacao: document.getElementById('ultima-irrigacao'),
            proximaIrrigacao: document.getElementById('proxima-irrigacao'),
            estadoAtual: document.getElementById('estado-atual'),
            salvar: document.getElementById('salvar')
        };

        // Event Listeners
        this.elementos.salvar.addEventListener('click', () => this.salvarConfiguracao());
        this.elementos.ativar.addEventListener('change', () => this.toggleSistema());

        // Carregar configurações salvas
        this.carregarConfiguracoes();
    }

    salvarConfiguracao() {
        const novoIntervalo = parseInt(this.elementos.intervalo.value);
        
        if (novoIntervalo < 1) {
            this.mostrarNotificacao('O intervalo mínimo é de 1 hora', 'error');
            return;
        }

        this.intervalo = novoIntervalo;
        this.mostrarNotificacao('Configurações salvas com sucesso!');
        
        if (this.ativo) {
            this.reiniciarTimer();
        }

        // Salvar no localStorage
        this.salvarConfiguracoes();
    }

    toggleSistema() {
        this.ativo = this.elementos.ativar.checked;
        this.elementos.status.textContent = this.ativo ? 'Sistema Ativado' : 'Sistema Desativado';
        
        if (this.ativo) {
            this.iniciarIrrigacao();
        } else {
            this.pararIrrigacao();
        }

        this.salvarConfiguracoes();
    }

    iniciarIrrigacao() {
        this.realizarIrrigacao();
        this.reiniciarTimer();
    }

    pararIrrigacao() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.elementos.estadoAtual.textContent = 'Inativo';
        this.elementos.proximaIrrigacao.textContent = '--:--';
    }

    realizarIrrigacao() {
        const agora = new Date();
        this.ultimaIrrigacao = agora;
        this.proximaIrrigacao = new Date(agora.getTime() + this.intervalo * 3600000);
        
        this.elementos.ultimaIrrigacao.textContent = this.formatarData(this.ultimaIrrigacao);
        this.elementos.proximaIrrigacao.textContent = this.formatarData(this.proximaIrrigacao);
        this.elementos.estadoAtual.textContent = 'Irrigando...';
        
        // Simular irrigação por 5 segundos
        setTimeout(() => {
            this.elementos.estadoAtual.textContent = 'Aguardando';
        }, 5000);
    }

    reiniciarTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.realizarIrrigacao();
        }, this.intervalo * 3600000);
    }

    formatarData(data) {
        return data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = mensagem;
        notification.style.backgroundColor = tipo === 'success' ? '#4CAF50' : '#f44336';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    salvarConfiguracoes() {
        const config = {
            intervalo: this.intervalo,
            ativo: this.ativo
        };
        localStorage.setItem('irrigacaoConfig', JSON.stringify(config));
    }

    carregarConfiguracoes() {
        const configSalva = localStorage.getItem('irrigacaoConfig');
        if (configSalva) {
            const config = JSON.parse(configSalva);
            this.intervalo = config.intervalo;
            this.elementos.intervalo.value = this.intervalo;
            this.elementos.ativar.checked = config.ativo;
            if (config.ativo) {
                this.toggleSistema();
            }
        }
    }
}

// Inicializar o sistema
const sistema = new SistemaIrrigacao(); 