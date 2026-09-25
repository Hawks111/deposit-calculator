import {useState, type SubmitEvent} from 'react';

type Calculation = { total: number; profit: number };
type FieldErrors = Record<string, string>;
type ApiError = { error?: string; fields?: FieldErrors };

const money = new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB', minimumFractionDigits: 2
});

export default function App() {
    const [amount, setAmount] = useState('100000');
    const [months, setMonths] = useState('12');
    const [rate, setRate] = useState('8');
    const [result, setResult] = useState<Calculation | null>(null);
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function calculate(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setResult(null);
        const values = {amount: Number(amount), months: Number(months), rate: Number(rate)};
        if (!amount || !months || !rate ||
            !Number.isFinite(values.amount) || !Number.isFinite(values.months) || !Number.isFinite(values.rate) ||
            values.amount < 1000 || values.amount > 10_000_000 ||
            !Number.isInteger(values.months) || values.months < 1 || values.months > 60 ||
            values.rate < 1 || values.rate > 20) {
            setError('Введите сумму от 1 000 до 10 000 000 ₽, срок от 1 до 60 месяцев и ставку от 1 до 20%.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values)
            });
            if (!response.ok) {
                const body: ApiError = await response.json();
                throw new Error([body.error, ...Object.values(body.fields ?? {})].filter(Boolean).join(': ')
                    || `Ошибка сервера: ${response.status}`);
            }
            const body: Calculation = await response.json();
            setCalculatedAmount(values.amount);
            setResult(body);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Не удалось связаться с сервером.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="card">
            <h1>Калькулятор вклада</h1>
            <p className="intro">Узнайте доход с ежемесячной капитализацией процентов.</p>
            <form onSubmit={calculate}>
                <label htmlFor="amount">Сумма вклада, ₽</label>
                <input id="amount" type="number" min="1000" max="10000000" step="0.01"
                       value={amount} onChange={event => setAmount(event.target.value)} required/>

                <label htmlFor="months">Срок, месяцев</label>
                <input id="months" type="number" min="1" max="60" step="1"
                       value={months} onChange={event => setMonths(event.target.value)} required/>

                <label htmlFor="rate">Годовая ставка, %</label>
                <input id="rate" type="number" min="1" max="20" step="0.01"
                       value={rate} onChange={event => setRate(event.target.value)} required/>

                <button type="submit" disabled={loading}>{loading ? 'Считаем…' : 'Рассчитать'}</button>
            </form>

            {error && <p className="error" role="alert">{error}</p>}
            {result && calculatedAmount !== null && (
                <section className="result" aria-live="polite">
                    <h2>Результат</h2>
                    <dl>
                        <div>
                            <dt>Начальная сумма</dt>
                            <dd>{money.format(calculatedAmount)}</dd>
                        </div>
                        <div>
                            <dt>Итоговая сумма</dt>
                            <dd>{money.format(result.total)}</dd>
                        </div>
                        <div>
                            <dt>Доход</dt>
                            <dd>{money.format(result.profit)}</dd>
                        </div>
                    </dl>
                </section>
            )}
        </main>
    );
}
